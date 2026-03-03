import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const categorySearchMap: Record<string, string> = {
  'mri-coils': 'MRI Coils',
  'gradient-amplifiers': 'Gradient Amplifier',
  'rf-amplifiers': 'RF Amplifier',
  'cold-heads': 'Cold Head',
  'compressors': 'Compressor',
  'head-coils': 'Head Coil',
  'body-coils': 'Body Coil',
  'knee-coils': 'Knee Coil',
  'spine-coils': 'Spine Coil',
  'extremity-coils': 'Extremity Coil',
  'coils': 'Coils',
};

const PartsCategory = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const search = category ? categorySearchMap[category] || category.replace(/-/g, ' ') : 'parts';
    navigate(`/products?query=${encodeURIComponent(search)}`, { replace: true });
  }, [category, navigate]);

  return null;
};

export default PartsCategory;
