// Import the functions you need from the SDKs you need
import firebase from '../firebase/firebaseTransactions'
import bcrypt from "bcryptjs";

interface Transaction {
  id: number;
  category: string;
  amount: number;
  business: string;
  date: string;
  icon: string;
}

interface BudgetLimit {
  category_name: string;
  category_spend: number;
  category_limit?: number;
}

interface MonthlyBudget {
  date: string;
  limits: BudgetLimit[];
  total_spend?: number;
  total_limit?: number;
}

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  role: string;
}

interface BankAccount {
  bank_name: string;
  account_number: string;
  expiration_date: string;
  cvv: string;
  data: Transaction[];
}

interface BankData {
  user_id: string;
  bank_accounts: BankAccount[];
}

let auxTransactions: Transaction[] = [];
let transactions_a: Transaction[] = [];
let previousBudgets: Record<string, MonthlyBudget> = {};

const spend_category: string[] = [
    "Tiendas minoristas",
    "Supermercados y tiendas de comestibles",
    "Restaurantes y cafés",
    "Entretenimiento y ocio",
    "Salud y bienestar",
    "Transporte",
    "Educación y formación",
    "Vivienda y servicios",
    "Viajes y turismo",
    "Servicios financieros",
    "Tecnología y suscripciones",
    "Aficiones y recreación",
    "Donaciones y caridad",
    "Bizum"
];

const sc_business_name: Record<string, string[]> = {
    "Tiendas minoristas": [
        "El Corte Inglés", "Carrefour", "Alcampo", "Decathlon", "MediaMarkt", "Bershka", 
        "Pull & Bear", "Stradivarius", "Zara", "Mango", "Desigual", "Springfield", "Cortefiel", 
        "Massimo Dutti", "Lefties", "Primark España", "Fnac", "Tiger", "Parfois", "Misako"
    ],
    "Supermercados y tiendas de comestibles": [
        "Mercadona", "Día", "Carrefour Market", "Alcampo", "Eroski", "Lidl", "Aldi", "Supercor", 
        "Consum", "Hipercor", "BM Supermercados", "Ahorramas", "Coviran", "Froiz", "Gadis", 
        "Bonpreu", "Spar España", "HiperDino", "La Sirena", "El Árbol"
    ],
    "Restaurantes y cafés": [
        "Vips", "100 Montaditos", "Telepizza", "Ginos", "Rodilla", "Pans & Company", "Foster’s Hollywood", 
        "El Brillante", "La Sureña", "Cañas y Tapas", "Goiko", "Hamburguesa Nostra", "Lateral", 
        "TGB - The Good Burger", "La Tagliatella", "UDON", "Casa Dani", "Casa Lucio", "Restaurante Botín", "Dunkin'"
    ],
    "Entretenimiento y ocio": [
        "Cinesa", "Yelmo Cines", "Kinépolis", "Ocine", "Autocine Madrid RACE", "PortAventura", "Parque Warner", 
        "Siam Park", "Terra Mítica", "Zoo de Madrid", "Loro Parque", "Aquópolis", "Museo del Prado", 
        "Museo Reina Sofía", "Teatro Español", "Gran Teatro del Liceu", "Sala Apolo", "Razzmatazz", 
        "Shôko Madrid", "WiZink Center"
    ],
    "Salud y bienestar": [
        "Farmacias 24h", "Farmacias Ecoceutics", "Farmacias Alphega", "Vitaldent", "Sanitas", "Quirónsalud", 
        "Dorsia Clínicas", "Clínicas Baviera", "Oftalvist", "McFIT", "Basic-Fit", "O2 Centro Wellness", 
        "Metropolitan", "Anytime Fitness", "EVOfit", "Vivagym", "Altafit", "Asssa Seguros", "Adeslas", "DKV"
    ],
    "Transporte": [
        "Cabify", "Uber", "BlaBlaCar", "Renfe", "Metro de Madrid", "TMB Barcelona", "Euskotren", 
        "Ouigo", "Iryo", "Avanza", "ALSA", "Socibus", "Repsol", "Cepsa", "Galp", "BP", "Petronor", 
        "Shell España", "Goldcar", "Europcar"
    ],
    "Educación y formación": [
        "Domestika", "Aprendum", "Tutellus", "UNED", "Google Activate", "CEAC", "EF Education First", 
        "Instituto Cervantes", "Universidad Complutense de Madrid", "Universidad de Barcelona", 
        "Universidad Autónoma de Madrid", "Universidad Politécnica de Valencia", "Udemy", "Coursera", 
        "LinkedIn Learning", "Formación Profesional CCC", "MasterD", "Campus Training", "EAE Business School", "Esade"
    ],
    "Vivienda y servicios": [
        "IKEA", "Conforama", "Leroy Merlin", "Bauhaus", "Brico Depôt", "Zara Home", "H&M Home", "Maisons du Monde", 
        "Casa Viva", "Vitra", "Endesa", "Iberdrola", "Naturgy", "Repsol Luz", "Acciona Energía", "Movistar", 
        "Orange", "Vodafone", "Yoigo", "Pepephone"
    ],
    "Viajes y turismo": [
        "Iberia", "Air Europa", "Vueling", "Ryanair", "NH Hoteles", "Meliá", "Barceló", "Riu Hotels", 
        "Paradores", "Booking.com", "Trivago", "Edreams", "Viajes El Corte Inglés", "Atrápalo", 
        "Renfe Viajeros", "MSC Cruceros", "Pullmantur", "Binter Canarias", "Volotea", "Iryo"
    ],
    "Servicios financieros": [
        "BBVA", "Santander", "CaixaBank", "Banco Sabadell", "Bankinter", "EVO Banco", "ING España", "Abanca", 
        "Kutxabank", "Ibercaja", "Unicaja Banco", "Openbank", "Bizum", "PayPal", "Revolut", "N26", "Wise", 
        "Bnext", "Banco Mediolanum", "Cajasur"
    ],
    "Tecnología y suscripciones": [
        "Netflix", "HBO Max", "Disney+", "Prime Video", "Filmin", "Movistar Plus+", "Spotify", "Apple Music", 
        "Tidal", "YouTube Premium", "Dropbox", "Google One", "Microsoft 365", "Adobe Creative Cloud", 
        "Canva Pro", "Notion", "GitHub", "Twitch", "Crunchyroll", "DAZN"
    ],
    "Aficiones y recreación": [
        "Decathlon", "Forum Sport", "Base Deportes", "Adidas", "Nike", "Joma", "New Balance", "Salomon", 
        "The North Face", "El Ganso", "Hobby Consolas", "Juguettos", "LEGO Store", "Game", "Fnac", 
        "MediaMarkt", "Casa del Libro", "El Dragón Lector", "Atlántica Juegos", "Magic Madrid"
    ],
    "Donaciones y caridad": [
        "Cruz Roja Española", "Médicos Sin Fronteras", "Unicef España", "Save the Children", 
        "Caritas", "World Wildlife Fund", "Fundación Vicente Ferrer", "Banco de Alimentos", 
        "ACNUR", "Greenpeace España", "Aldeas Infantiles SOS", "Manos Unidas", "Fundación ONCE", 
        "Plan International España", "Amnistía Internacional", "Médicos del Mundo", 
        "Fundación Josep Carreras", "Asociación Española Contra el Cáncer", "Open Arms", "Educo"
    ],
    "Bizum": [
        "Alejandro", "Sofía", "Mateo", "Valentina", "Lucas", 
        "Isabella", "Diego", "Camila", "Javier", "Martina", 
        "Carlos", "Elena", "Fernando", "Lucía", "Gabriel", 
        "Mariana", "Ricardo", "Paula", "Sebastián", "Daniela"
    ]
};

const sc_spend_range: Record<string, [number, number]> = {
    "Tiendas minoristas": [5, 70],
    "Supermercados y tiendas de comestibles": [10, 70],
    "Restaurantes y cafés": [3, 60],
    "Entretenimiento y ocio": [5, 100],
    "Salud y bienestar": [10, 200],
    "Transporte": [1, 20],
    "Educación y formación": [15, 25],
    "Vivienda y servicios": [50, 120],
    "Viajes y turismo": [20, 340],
    "Servicios financieros": [1, 200],
    "Tecnología y suscripciones": [2, 20],
    "Aficiones y recreación": [5, 70],
    "Donaciones y caridad": [1, 15],
    "Bizum": [0.50, 50]
};

const sc_icon: Record<string, string> = {
    "Tiendas minoristas": "fas fa-store",
    "Supermercados y tiendas de comestibles": "fas fa-shopping-basket",
    "Restaurantes y cafés": "fas fa-utensils",
    "Entretenimiento y ocio": "fas fa-film",
    "Salud y bienestar": "fas fa-heartbeat",
    "Transporte": "fas fa-bus",
    "Educación y formación": "fas fa-graduation-cap",
    "Vivienda y servicios": "fas fa-home",
    "Viajes y turismo": "fas fa-plane",
    "Servicios financieros": "fas fa-university",
    "Tecnología y suscripciones": "fas fa-laptop",
    "Aficiones y recreación": "fas fa-gamepad",
    "Donaciones y caridad": "fas fa-hands-helping",
    "Bizum": "fas fa-hand-holding-usd"
};


function getRandomDate(month: number, year: number): Date {
  const daysInMonth = new Date(year, month, 0).getDate();
  const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
  return new Date(year, month - 1, randomDay);
}

function getMonthYear(dateStr: string): string {
  const date = dateStr.split('/')
  const month = Number(date[1])
  const year = Number(date[2])
  return `${month.toString().padStart(2, '0')}/${year}`;
}

function isCurrentMonth(dateStr: string): boolean {
  const date = dateStr.split('/')
  const month = Number(date[1])
  const year = Number(date[2])
  const today = new Date();
  return month === today.getMonth() + 1 && year === today.getFullYear();
}

function setPreviousBudgets(transactions: Transaction[]): void {
  transactions.forEach(transaction => {
    if (isCurrentMonth(transaction.date)) return;
    if (transaction.amount >= 0) return;

    const monthYear = getMonthYear(transaction.date);

    if (!previousBudgets[monthYear]) {
      previousBudgets[monthYear] = {
        date: monthYear,
        limits: []
      };
    }

    const budget = previousBudgets[monthYear];
    const limit = budget.limits.find(l => l.category_name === transaction.category);

    if (!limit) {
      budget.limits.push({
        category_name: transaction.category,
        category_spend: Math.abs(transaction.amount)
      });
    } else {
      limit.category_spend += Math.abs(transaction.amount);
    }
  });
}

function setLimits(): void {
  Object.values(previousBudgets).forEach(budget => {
    let totalSpend = 0, totalLimit = 0;
    budget.limits.forEach(limit => {
      limit.category_limit = Math.floor(limit.category_spend * (1 + Math.random() * 0.2));
      totalSpend += limit.category_spend;
      totalLimit += limit.category_limit;
    });
    budget.total_spend = totalSpend;
    budget.total_limit = totalLimit;
  });
}

function generateExpendCard(month: number, year: number): Transaction {
  const s_cat = spend_category[Math.floor(Math.random() * spend_category.length)];
  const s_cat_array = sc_business_name[s_cat];
  const [min, max] = sc_spend_range[s_cat];
  const cardDate = getRandomDate(month, year);

  const card: Transaction = {
    id: auxTransactions.length + 1,
    category: s_cat,
    amount: -(Math.floor(Math.random() * (max - min)) + min),
    business: s_cat_array[Math.floor(Math.random() * s_cat_array.length)],
    date: cardDate.toLocaleDateString(),
    icon: sc_icon[s_cat]
  };
  auxTransactions.push(card);
  return card;
}

function generateIncomeCard(month: number, year: number): Transaction {
  const cardDate = getRandomDate(month, year);
  const card: Transaction = {
    id: auxTransactions.length + 1,
    category: "Trabajo",
    amount: 1800,
    business: "Nómina mensual",
    date: cardDate.toLocaleDateString(),
    icon: "fas fa-money-bill-wave"
  };
  auxTransactions.push(card);
  return card;
}

async function loadUserData(
  p_fullName: string,
  p_email: string,
  p_password: string,
  p_phone: string,
  p_country: string,
  p_bankName: string,
  p_bankAccountNumber: string,
  p_expirationDate: string,
  p_cvv: string,
  p_id: string): Promise<void> {

  const plainPassword = p_password;
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  const id = p_id;
  const email = p_email;
  
  const fullName = p_fullName.trim();
  const [p_name, ...surnameParts] = fullName.split(' ');
  const p_surname = surnameParts.length > 0 ? surnameParts.join(' ') : '';

  const user: User = {
    id,
    name: p_name,
    surname: p_surname,
    email,
    password: hashedPassword,
    phone: p_phone,
    country: p_country,
    role: "full-service"
  };


  await firebase.setData("user_data", email, user);

  const bankData: BankData = {
    user_id: id,
    bank_accounts: [
      {
        bank_name: p_bankName,
        account_number: p_bankAccountNumber,
        expiration_date: p_expirationDate,
        cvv: p_cvv,
        data: transactions_a
      }
    ]
  };

  await firebase.setData("bank_data", id, bankData);
  await firebase.setData("previous_budgets", id, previousBudgets);
}

async function main(
  fullName: string,
  email: string,
  password: string,
  phone: string,
  country: string,
  bankName: string,
  bankAccountNumber: string,
  expirationDate: string,
  cvv: string,
  id: string): Promise<void> {

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  function getMonthYearOffset(offset: number): { month: number; year: number } {
    const date = new Date(currentYear, currentMonth - 1 - offset, 1);
    return { month: date.getMonth() + 1, year: date.getFullYear() };
  }

  for (let offset = 0; offset < 24; offset++) {
    const { month, year } = getMonthYearOffset(offset);
    transactions_a.push(generateIncomeCard(month, year));
    Array.from({ length: 10 }, () => transactions_a.push(generateExpendCard(month, year)));
  }

  setPreviousBudgets(transactions_a);
  setLimits();

  await loadUserData(fullName, email, password, phone, country, bankName, bankAccountNumber, expirationDate, cvv, id);
  console.log("All data loaded successfully!");
}

export default {main};
