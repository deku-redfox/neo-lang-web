import {
  BookOpen,
  Globe,
  Smartphone,
  Monitor,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {

  return (
    <main className="min-h-screen bg-white">
      <NavBar />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-200/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-30">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Apprenez les langues
              <span className="text-highlight-second"> facilement</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Une plateforme complète pour maîtriser de nouvelles langues avec des leçons interactives,
              disponible sur mobile et web.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/api/start"
                className="cursor-pointer bg-highlight-second text-white hover:bg-highlight-second/60 px-8 py-3 rounded-lg text-lg font-bold"
              >
                Commencer rapidement
              </Link>
              <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg text-lg font-bold">
                En savoir plus
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Apprenez où que vous soyez
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Notre plateforme s&apos;adapte à votre mode de vie avec des applications mobile et web synchronisées.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-highlight" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Mobile</h3>
              <p className="text-gray-600">Apprenez en déplacement avec notre app mobile intuitive</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="h-8 w-8 text-highlight" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Version Web</h3>
              <p className="text-gray-600">Interface complète pour une expérience d&apos;apprentissage optimale</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-highlight" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Contenu Riche</h3>
              <p className="text-gray-600">Leçons interactives avec audio, images et exercices variés</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-highlight py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à commencer votre apprentissage ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez des milliers d&apos;apprenants qui maîtrisent déjà de nouvelles langues
          </p>
          <Link href='/auth?form=register'
            className="bg-white text-highlight hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-bold inline-flex items-center"
          >
            Commencer maintenant
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </main>
  );
}

const NavBar = function () {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href='/' className="flex items-center">
            <Globe className="h-8 w-8 text-highlight" />
            <span className="max-sm:hidden ml-2 text-xl font-bold text-gray-900">Neo-Lang</span>
          </Link>
          <div className="flex space-x-4">
            <Link href='/auth?form=login'
              className="text-gray-700 hover:text-highlight px-3 py-2 rounded-md text-sm font-bold"
            >
              Connexion
            </Link>
            <Link href='/auth?form=register'
              className="bg-highlight-second text-white hover:bg-highlight-second/40 px-4 py-2 rounded-md text-sm font-bold"
            >
              S&apos;inscrire
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

