// Category to image mapping for templates
import recruitmentTile from '@/assets/templates/recruitment-tile.jpg';
import salesTile from '@/assets/templates/sales-tile.jpg';
import supportTile from '@/assets/templates/support-tile.jpg';
import operationsTile from '@/assets/templates/operations-tile.jpg';
import financeTile from '@/assets/templates/finance-tile.jpg';
import ecommerceTile from '@/assets/templates/ecommerce-tile.jpg';
import healthcareTile from '@/assets/templates/healthcare-tile.jpg';
import realestateTile from '@/assets/templates/realestate-tile.jpg';
import aiAgentVisual from '@/assets/ai-agent-visual.jpg';

export const categoryImages: Record<string, string> = {
  'Recruitment': recruitmentTile,
  'Sales': salesTile,
  'Support': supportTile,
  'Operations': operationsTile,
  'Finance': financeTile,
  'E-commerce': ecommerceTile,
  'Healthcare': healthcareTile,
  'Real Estate': realestateTile,
};

export const aiAgentImage = aiAgentVisual;

export function getCategoryImage(category: string): string {
  return categoryImages[category] || salesTile;
}
