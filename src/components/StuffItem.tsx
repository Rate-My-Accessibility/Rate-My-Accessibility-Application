import { Stuff } from '@prisma/client';
import Link from 'next/link';

/* Renders a single row in the List Stuff table. See list/page.tsx. */
const StuffItem = ({ name, location, quantity, feature, id }: Stuff) => (
  <tr>
    <td>{name}</td>
    <td>{location}</td>
    <td>{feature}</td>
    <td>{quantity}</td>
    <td>
      <Link href={`/edit/${id}`}>Edit</Link>
    </td>
  </tr>
);

export default StuffItem;
