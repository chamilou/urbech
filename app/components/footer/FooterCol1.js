import Link from "next/link";
export default function FooterColumn1() {
  return (
    <div>
      <h3>*Магазин*</h3>
      <ul>
        <li>
          <Link href={"/about"}>Про нас</Link>
        </li>
        <Link href={"/colaboration"}>Сотрудничество</Link>

        <li>Blog</li>
      </ul>
    </div>
  );
}
