import App from '../../App';

export default async function ForgotPasswordPage({ searchParams }) {
  const params = await searchParams;
  const role = typeof params?.role === 'string' ? params.role : null;

  return <App page="forgot" role={role} />;
}
