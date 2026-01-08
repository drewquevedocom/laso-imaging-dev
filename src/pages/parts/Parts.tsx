import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Parts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to products page filtered by parts categories
    navigate('/products?query=product_type:"MRI Parts" OR product_type:"RF Coils" OR product_type:"CT Parts" OR product_type:"Power Supplies"', { replace: true });
  }, [navigate]);

  return null;
};

export default Parts;
