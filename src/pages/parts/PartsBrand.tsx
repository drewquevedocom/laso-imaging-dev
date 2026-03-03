import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const brandSearchMap: Record<string, string> = {
  'ge': 'GE parts',
  'siemens': 'Siemens parts',
  'philips': 'Philips parts',
  'toshiba': 'Toshiba parts',
  'canon': 'Canon parts',
  'hitachi': 'Hitachi parts',
};

const PartsBrand = () => {
  const { brand } = useParams<{ brand: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const search = brand ? brandSearchMap[brand] || `${brand} parts` : 'parts';
    navigate(`/products?query=${encodeURIComponent(search)}`, { replace: true });
  }, [brand, navigate]);

  return null;
};

export default PartsBrand;
