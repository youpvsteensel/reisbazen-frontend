import BlokPagina from '../components/BlokPagina';
import { blokken } from '../data/reisData';

export default function MelbournePage() {
  return <BlokPagina blok={blokken.melbourne} />;
}
