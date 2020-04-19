import {useCallback} from 'react'
import { toast } from 'react-toastify';

export const useMessage = () => {
  let toastId = null;

  return useCallback((text, status='info') => {
    if (! toast.isActive(toastId) && text) {
      toastId = toast[status](text,{
        className: 'notification',
        bodyClassName: "notification__content",
        progressClassName: 'notification__progressbar'
      });
    }
  }, [])
}
