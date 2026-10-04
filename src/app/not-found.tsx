export default function NotFound() {
  return (
    <main className="simple">
      <div className="wrap">
        <h1>Esta página no existe</h1>
        <p className="lead">Puede que el link esté mal escrito o que la hayamos movido.</p>
        <div className="actions"><a className="btn btn-orange" href="/">Ir al inicio</a></div>
      </div>
    </main>
  );
}
