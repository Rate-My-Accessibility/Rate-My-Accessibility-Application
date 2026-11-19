import { Stuff } from '@prisma/client';

/* Renders a single row in the List Stuff table. See list/page.tsx. */
const StuffItemAdmin = ({ name, location, feature, quantity, owner, id }: Stuff) => (
  <tr>
    <td>{name}</td>
    <td>{location}</td>
    <td>{feature}</td>
    <td>{quantity}</td>
    <td>{owner}</td>
    <td>
      <a href={`/edit/${id}`}>Edit</a>
    </td>
  </tr>
);

export default StuffItemAdmin;
