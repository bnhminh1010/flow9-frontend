import { Package, Utensils, ShoppingBag, Car, FileText, Film, DollarSign, PlusCircle } from 'lucide-react';

interface CategoryIconProps {
  categoryName: string;
  className?: string;
}

export function CategoryIcon({ categoryName, className = "w-5 h-5" }: CategoryIconProps) {
  const ICONS: Record<string, any> = {
    'Ăn uống': Utensils,
    'Food': Utensils,
    'Mua sắm': ShoppingBag,
    'Shopping': ShoppingBag,
    'Đi lại': Car,
    'Transport': Car,
    'Hoá đơn': FileText,
    'Bills': FileText,
    'Giải trí': Film,
    'Entertainment': Film,
    'Lương': DollarSign,
    'Salary': DollarSign,
    'Thưởng': PlusCircle,
    'Bonus': PlusCircle,
  };

  const nameUpper = categoryName.toUpperCase();
  
  if (nameUpper.includes('NETFLIX')) {
    return <div className="font-black text-[10px] leading-none text-red-600 bg-red-900/20 px-1 py-0.5 border-2 border-red-900/50 rounded-[2px] group-hover:text-red-500 group-hover:border-red-500 transition-colors">N</div>;
  }
  if (nameUpper.includes('SPOTIFY')) {
    return <div className="font-black text-[10px] leading-none text-green-500 bg-green-900/20 px-1 py-0.5 border-2 border-green-900/50 rounded-[2px] group-hover:text-green-400 group-hover:border-green-400 transition-colors">S</div>;
  }
  if (nameUpper.includes('YOUTUBE')) {
    return <div className="font-black text-[10px] leading-none text-red-500 bg-red-900/20 px-1 py-0.5 border-2 border-red-900/50 rounded-[2px] group-hover:text-white transition-colors">YT</div>;
  }
  if (nameUpper.includes('APPLE')) {
    return <div className="font-black text-[10px] leading-none text-[#A1A1AA] bg-[#222] px-1 py-0.5 border-2 border-[#444] rounded-[2px] group-hover:text-white transition-colors">A</div>;
  }

  const Icon = ICONS[categoryName] || Package;
  return <Icon className={className} strokeWidth={1.5} />;
}
