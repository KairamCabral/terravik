// Redirect da rota antiga para a nova página de customização
import { redirect } from 'next/navigation';

export default function AdminBannersRedirect() {
  redirect('/admin/customizacao');
}
