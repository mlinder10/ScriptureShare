import Link from "next/link";
import styles from "./styles/navbar.module.css";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <Link href="/">Read</Link>
      <Link href="compare">Compare</Link>
      <Link href="/">
        <Image src="/logo.png" alt="logo" width={50} height={50} />
      </Link>
      <Link href="/search">Search</Link>
      <Link href="/account">Account</Link>
    </header>
  );
}
