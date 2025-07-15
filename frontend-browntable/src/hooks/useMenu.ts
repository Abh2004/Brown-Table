import { useState, useEffect } from 'react';
import { menuAPI } from '../services/api';
import type { MenuItem } from '../services/api';

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuData {
  data: MenuSection[];
}

interface UseMenuReturn {
  menuData: MenuData | null;
  loading: boolean;
  error: string | null;
  refreshMenu: () => Promise<void>;
}

export const useMenu = (): UseMenuReturn => {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMenu = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await menuAPI.getMenu();
      
      if (response.success) {
        setMenuData(response.data);
        console.log("✅ Menu loaded successfully");
      } else {
        throw new Error(response.message || "Failed to load menu");
      }
    } catch (err: any) {
      console.error("❌ Failed to load menu:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to load menu";
      setError(errorMessage);
      
      // Fallback to local menu data
      try {
        const fallbackMenu = await import('../components/menuData.json');
        // Type assertion to ensure compatibility
        const typedFallbackMenu: MenuData = {
          data: fallbackMenu.default.data.map((section: any) => ({
            title: section.title,
            items: section.items.map((item: any) => ({
              id: item.id,
              name: item.name,
              description: item.description,
              price: item.price,
              type: (item.type as 'veg' | 'non-veg'),
              category: item.category,
            }))
          }))
        };
        setMenuData(typedFallbackMenu);
        console.log("⚠️ Using fallback menu data");
      } catch (fallbackError) {
        console.error("❌ Failed to load fallback menu:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const refreshMenu = async () => {
    await loadMenu();
  };

  return {
    menuData,
    loading,
    error,
    refreshMenu,
  };
}; 