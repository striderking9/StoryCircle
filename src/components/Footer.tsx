export default function Footer() {
    return (
      <footer className="bg-gray-100 dark:bg-gray-900 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Mon Blog. Tous droits réservés.
          </p>
        </div>
      </footer>
    );
  }
  