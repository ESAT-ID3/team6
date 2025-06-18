import './SignUp.css';
import visible_icon from '../assets/icons/eye.jpg';
import invisible_icon from '../assets/icons/eye-off.jpg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Input from '../components/ui/input/Input';
import Button from '../components/ui/button/Button';
import register from '../services/demo/demoData';

const SignUp = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [signUpFase, setSignUpFase] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [bankName, setBankName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [dni, setDni] = useState('');

  const [dataError, setDataError] = useState('')

  const isFormValid = fullName && email && password && phone && country && termsAccepted;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormValid && validatePartOne()) {
      setSignUpFase(2);
    } else {
      console.log("Change the info to submit");
    }
  };

  const goBack = () => {
    setSignUpFase(1);
  };

  const checkNameFormat = () => {
    const NAME_REGEXP = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
    let result = NAME_REGEXP.test(fullName.trim())
    if (!result) setDataError('El nombre debe contener solo letras y espacios, sin números ni caracteres especiales.')
    return result;
  };

  const checkEmailFormat = () => {
    const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let result = EMAIL_REGEXP.test(email)
    if (!result) setDataError('Introduce una dirección de correo electrónico válida.')
    return result;
  };

  const checkPasswordFormat = () => {
    const REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[a-zA-Z\d\W_]{6,}$/;
    let result = REGEXP.test(password)
    if (!result) setDataError('La contraseña debe tener al menos 6 caracteres, incluyendo una mayúscula, una minúscula, un número y un símbolo.')
    return result;
  };

  const validatePartOne = () => {
    let result = checkNameFormat() && checkEmailFormat() && checkPasswordFormat();
    if (result) setDataError('')
    return result
  };

  const checkIdFormat = () => {
    const ID_REGEXP = /^(\d{8}[A-Z]|[XYZ]\d{7}[A-Z])$/;
    let result = ID_REGEXP.test(dni)
    if (!result) setDataError('Introduzca un documento de identificación válido')
    return result;
  };

  const checkAccountNumberFormat = () => {
    const cleaned = bankAccountNumber.replace(/[\s-]/g, '');
    const CARD_NUMBER_REGEX = /^\d{13,19}$/;
    let result = CARD_NUMBER_REGEX.test(cleaned);
    if (!result) setDataError('Introduzca un número de tarjeta válido')
    return result;
  };

  const checkExpirationDateFormat = () => {
    const EXP_DATE_REGEX = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!EXP_DATE_REGEX.test(expirationDate)) {
      setDataError('La fecha de caducidad debe estar en formato MM/YY')
      return false;
    }
    const [monthStr, yearStr] = expirationDate.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt('20' + yearStr, 10);
    const now = new Date();
    // JS months are zero-based, so subtract 1 from month for correct date comparison
    const expDate = new Date(year, month - 1, 1);
    let result = expDate > now;
    if (!result) setDataError('La fecha de caducidad debe ser posterior')
    return result
  };

  const checkCvvFormat = () => {
    const CVV_REGEX = /^\d{3,4}$/;
    let result = CVV_REGEX.test(cvv)
    if (!result) setDataError('Introduzca un CVV válido')
    return result;
  };

  const validatePartTwo = () => {
    let result = checkIdFormat() && checkAccountNumberFormat() && checkCvvFormat() && checkExpirationDateFormat();
    if (result) setDataError('')
    return result
  };

  const submitData = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('submitData ejecutado'); // debug
    if (validatePartTwo()) {
      console.log('validado'); // debug
      register.main(fullName, email, password, phone, country, bankName, bankAccountNumber, expirationDate, cvv, dni).then(() => {
        const p_fullName = fullName.trim();
        const [p_name, ...surnameParts] = p_fullName.split(' ');
        const p_surname = surnameParts.length > 0 ? surnameParts.join(' ') : '';

        setUser({
          id: dni,
          email: email,
          password: password,
          name: p_name,
          surname: p_surname,
          role: 'full-service',
        });
        navigate('/personal/balance');
      });
    } else {
      console.log("Change the info to submit");
    }
  };

  return (
    <div className="signup-container">
      {signUpFase === 1 ? (
        <div className="signup-card">
          <div className="signup-header">
            <h2>Dashflow</h2>
            <p>Tu aplicación de gestión financiera</p>
          </div>
          <form className="signup-form" onSubmit={handleSubmit}>
            <h5>REGISTRO</h5>
            <Input
              placeholder="Introduzca su nombre completo"
              headline="Nombre y apellidos*"
              isPassword={false}
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
            />
            <Input
              placeholder="Ej: usuario@ejemplo.com"
              headline="Email*"
              isPassword={false}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <Input
              placeholder="Introduzca su contraseña"
              headline="Contraseña*"
              endingIcon={invisible_icon}
              alternativeEndingIcon={visible_icon}
              isPassword={true}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <Input
              placeholder="XXX-XXX-XXX"
              headline="Teléfono*"
              isPassword={false}
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
            />
            <div className="signup-select">
              <label htmlFor="country">País*</label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Elija una opción</option>
                <option value="spain">España</option>
                <option value="germany">Alemania</option>
                <option value="france">Francia</option>
                <option value="uk">Reino Unido</option>
                <option value="portugal">Portugal</option>
                <option value="usa">Estados Unidos</option>
              </select>
            </div>
            <div className="signup-checkbox">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label htmlFor="terms">
                Aceptar política de privacidad y términos de uso*
              </label>
            </div>
            {dataError && (
                <div className="login-error-message">
                    <small>{dataError}</small>
                </div>
            )}
            <Button
              variant="secondary"
              label="Continue"
              isDisabled={!isFormValid}
              isFilter={false}
              isFullWidth={true}
              buttonType="submit"
            />
            <p>
              ¿Ya tienes una cuenta?{' '}
              <a className="signup-login-link" href="/login">
                Inicia sesión
              </a>
            </p>
            <div className="signup-progress">1/2</div>
          </form>
        </div>
      ) : (
        <div className="signup-card">
          <div className="signup-header">
            <h2>Dashflow</h2>
            <p>Tu aplicación de gestión financiera</p>
          </div>
          <form className="signup-form" onSubmit={submitData}>
            <h5>Bank account details</h5>

            <div className="signup-select">
              <label htmlFor="banco">Nombre del banco</label>
              <select
                id="banco"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              >
                <option value="">Elija una opción</option>
                <option value="santander">Santander</option>
                <option value="bbva">BBVA</option>
                <option value="caixabank">CaixaBank</option>
              </select>
            </div>

            <div className="signup-select">
              <label htmlFor="tipo">Tipo de cuenta</label>
              <select
                id="tipo"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                <option value="">Elija una opción</option>
                <option value="ahorro">Cuenta de ahorro</option>
                <option value="corriente">Cuenta corriente</option>
              </select>
            </div>

            <Input
              placeholder="XXXX-XXXX-XXXX-XXXX"
              headline="Número de cuenta bancaria*"
              isPassword={false}
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value)}
            />

            <div className="bank-account-short-fields">
              <Input
                placeholder="MM/YY"
                headline="Fecha de caducidad*"
                isPassword={false}
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />

              <Input
                placeholder="XXX"
                headline="CVV*"
                isPassword={false}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
            </div>
            <Input
              placeholder="Introduzca su DNI o NIE"
              headline="Documento de Identificación*"
              isPassword={false}
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
            {dataError && (
                <div className="login-error-message">
                    <small>{dataError}</small>
                </div>
            )}
            <div className="submit-buttons">
              <Button
                variant="secondary"
                label="Atrás"
                isDisabled={false}
                isFilter={false}
                isFullWidth={true}
                onClick={goBack}
                buttonType="button"  // important! to avoid submitting form
              />
              <Button
                variant="primary"
                label="Registrarse"
                isDisabled={false}
                isFilter={false}
                isFullWidth={true}
                buttonType="submit"
              />
            </div>
            <div className="signup-progress">2/2</div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SignUp;
