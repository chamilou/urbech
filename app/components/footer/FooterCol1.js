import Link from "next/link";
export default function FooterColumn1() {
  return (
    <div>
      <h4>Company</h4>
      <ul>
        <li>
          <Link href={"/about"}>About</Link>
        </li>
        <li>Careers</li>
        <li>Blog</li>
      </ul>
    </div>
  );
}
