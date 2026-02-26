export default function PostLessonTips() {
  return (
    <div className="mt-8 bg-lila-50 rounded-xl p-6">
      <h3 className="font-semibold text-lila-800 mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Tipps für erfolgreiche Lektionen
      </h3>

      <ul className="space-y-2 text-sm text-lila-700">
        <li className="flex items-start">
          <span className="text-lila-500 mr-2">•</span>
          <span>Verwenden Sie aussagekräftige Titel mit Sprachniveau (A1, A2, B1, etc.)</span>
        </li>
        <li className="flex items-start">
          <span className="text-lila-500 mr-2">•</span>
          <span>Fügen Sie klare Lernziele und Übungsaufgaben in der Beschreibung hinzu</span>
        </li>
        <li className="flex items-start">
          <span className="text-lila-500 mr-2">•</span>
          <span>Videos sollten idealerweise 10-20 Minuten lang sein</span>
        </li>
        <li className="flex items-start">
          <span className="text-lila-500 mr-2">•</span>
          <span>Hochwertige Video- und Audioqualität verbessert das Lernerlebnis</span>
        </li>
      </ul>
    </div>
  );
}