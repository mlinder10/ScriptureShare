import Note from "@/models/Note";
import styles from "./styles/notecell.module.css";

type NoteProps = {
  note: Note;
};

export default function NoteCell({ note }: NoteProps) {
  return (
    <div className={styles.container}>
      <h3>{note.chapterId.replace(".", " ")}</h3>
      <div>
        {note.verses.map((verse) => (
          <span key={verse}>{verse}</span>
        ))}
      </div>
      <p>{note.content}</p>
      <p>{note.createdAt.toDateString()}</p>
    </div>
  );
}
