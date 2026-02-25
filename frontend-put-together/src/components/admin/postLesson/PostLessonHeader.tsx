type PostLessonHeaderProps = {
  title?: string;
  subtitle?: string;
};

export default function PostLessonHeader({
  title = "Neue Lektion erstellen",
  subtitle = "Laden Sie Videolektionen hoch und erstellen Sie begleitende Inhalte für Ihre Schüler",
}: PostLessonHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-lila-700 mb-2">{title}</h1>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
}