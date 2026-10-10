function Footer() {
  return (
    <footer className="bg-liga-azul text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Liga Deportiva Barrial José Ignacio Izurieta
        </p>
        <p className="text-xs text-liga-amarillo mt-1">
          Sistema digital oficial
        </p>
      </div>
    </footer>
  )
}

export default Footer