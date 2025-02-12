import { EnglishSentences } from "@/app/_components/englishSentences";
import { EnglishTranslate } from "@/app/_components/englishTranslate";

export default async function English() {
  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-purple-800">
          Hier lernen wir Englisch mit Sandra!
        </h1>
      </header>

      {/* Main Content */}
      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Component 1: Word Match Game */}
        <EnglishTranslate />
        {/* Component 2: Sentence Builder */}
        <EnglishSentences />
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center">
        <p className="text-gray-600">Keep learning, you are doing great! 🌟</p>
      </footer>
    </div>
  );
}
