import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import type {Lesson} from "../types/lesson";
import {
    getLessons,
    createLesson,
    deleteLesson,
} from "../services/lessonService";

type LessonContextType = {
    lessons: Lesson[];
    loading: boolean;
    loadLessons: () => Promise<void>;
    addLesson: (form: FormData) => Promise<void>;
    removeLesson: (id: string) => Promise<void>;
};

const LessonContext = createContext<LessonContextType | null>(null);

export function LessonProvider({children}: { children: ReactNode }) {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    async function loadLessons() {
        if (loaded) return; // cache
        setLoading(true);
        const data = await getLessons();
        setLessons(data);
        setLoaded(true);
        setLoading(false);
    }

    async function addLesson(form: FormData) {
        await createLesson(form);
        const data = await getLessons(); // refresh list
        setLessons(data);
    }

    async function removeLesson(id: string) {
        await deleteLesson(id);
        setLessons((prev) => prev.filter((l) => l.id !== id));
    }

    useEffect(() => {
        loadLessons();
    }, []);

    return (
        <LessonContext.Provider
            value={{lessons, loading, loadLessons, addLesson, removeLesson}}
        >
            {children}
        </LessonContext.Provider>
    );
}

export function useLessons() {
    const ctx = useContext(LessonContext);
    if (!ctx) {
        throw new Error("useLessons must be used inside LessonProvider");
    }
    return ctx;
}