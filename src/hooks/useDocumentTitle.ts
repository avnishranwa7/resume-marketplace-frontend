import { useEffect } from 'react';

const useDocumentTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | Resume Marketplace`;
  }, [title]);
};

export default useDocumentTitle; 