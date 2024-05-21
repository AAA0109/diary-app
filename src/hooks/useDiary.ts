import { DiaryContext } from 'contexts/DiaryContext';
import { useContext } from 'react';

// ----------------------------------------------------------------------

const useDiary = () => useContext(DiaryContext);

export default useDiary;
