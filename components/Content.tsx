import Chapter from "@/models/Chapter";
import styles from "../app/page.module.css";

type ContentProps = {
  content: string[][];
  selected: number[];
  handleSelect: (num: number) => void;
};
export default function Content({
  content,
  selected,
  handleSelect,
}: ContentProps) {
  return (
    <div className={styles.content}>
      {content.map((paragraph, key) => (
        <p key={key}>
          {paragraph.map((verse) => (
            <Verse
              key={verse}
              verse={verse}
              selected={selected}
              handleSelect={handleSelect}
            />
          ))}
        </p>
      ))}
    </div>
  );
}

type VerseProps = {
  verse: string;
  selected: number[];
  handleSelect: (num: number) => void;
};

function Verse({ verse, selected, handleSelect }: VerseProps) {
  const num = Chapter.getVerseNum(verse);
  return (
    <span
      className={isSelected(num, selected) ? styles.selected : styles.verse}
      onClick={() => handleSelect(num)}
    >
      {verse}
    </span>
  );
}

function isSelected(num: number, selected: number[]) {
  return selected.length !== 0 && selected[0] <= num && selected[1] >= num;
}
