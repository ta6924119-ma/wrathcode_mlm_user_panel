import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const POSITION = 'top-center';

const formatMessage = (msg, fallback) =>
  (msg && String(msg).trim()) ? String(msg).trim() : fallback;

export function alertErrorMessage(message) {
  toast.error(formatMessage(message, 'Something went wrong. Please try again.'), { position: POSITION });
}

export function alertSuccessMessage(message) {
  toast.success(formatMessage(message, 'Done.'), { position: POSITION });
}

export function alertInfoMessage(message) {
  toast.info(formatMessage(message, 'Info'), { position: POSITION });
}

export function alertWarningMessage(message) {
  toast.warning(formatMessage(message, 'Please check and try again.'), { position: POSITION });
}
