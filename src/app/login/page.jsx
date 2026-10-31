import App from '../../App';

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const role = typeof params?.role === 'string' ? params.role : null;

  return <App page="login" role={role} />;
}
