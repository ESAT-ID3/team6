import './SignUp.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/ui/input/Input';
import Button from '../components/ui/button/Button';

const SignUp = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const isFormValid = fullName && email && password && phone && country && termsAccepted;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      // Submit logic here
      navigate('/next-step');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h2>Dashflow</h2>
          <p>Tu aplicación de gestión financiera</p>
        </div>
        <form className="signup-form" onSubmit={handleSubmit}>
          <h5>REGISTRO</h5>
          <Input
            placeholder="Type your full name"
            headline="Full Name"
            isPassword={false}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            placeholder="Type your email"
            headline="Email"
            isPassword={false}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Type your password"
            headline="Password"
            isPassword={true}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            placeholder="000 000 000"
            headline="Phone"
            isPassword={false}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="signup-select">
            <label htmlFor="country">Country</label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Choose an option</option>
              <option value="spain">Spain</option>
              <option value="catalunya">Catalunya</option>
              <option value="colombia">Colombia</option>
              <option value="congo">Congo</option>
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
          <Button
            variant="secondary"
            label="Continue"
            isDisabled={!isFormValid}
            isFilter={false}
            isFullWidth={true}
            onClick={() => {}}
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
    </div>
    );
}
export default SignUp;
