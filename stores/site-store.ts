import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CarouselConfig, CampaignConfig, defaultCarousel, defaultCampaign } from '@/lib/campaigns/campaign-config';

interface SiteState {
  carousel: CarouselConfig;
  campaign: CampaignConfig;
  setCarousel: (config: CarouselConfig) => void;
  setCampaign: (config: CampaignConfig) => void;
  setCampaignEnabled: (enabled: boolean) => void;
  resetCarousel: () => void;
  resetCampaign: () => void;
  resetAll: () => void;
}

export const useSiteStore = create<SiteState>()(
  persist(
    (set) => ({
      carousel: defaultCarousel,
      campaign: defaultCampaign,

      setCarousel: (config: CarouselConfig) => {
        set({ carousel: config });
      },

      setCampaign: (config: CampaignConfig) => {
        set({ campaign: config });
      },

      setCampaignEnabled: (enabled: boolean) => {
        set((state) => ({
          campaign: { ...state.campaign, enabled },
        }));
      },

      resetCarousel: () => {
        set({ carousel: defaultCarousel });
      },

      resetCampaign: () => {
        set({ campaign: defaultCampaign });
      },

      resetAll: () => {
        set({ carousel: defaultCarousel, campaign: defaultCampaign });
      },
    }),
    {
      name: 'site-storage-v1',
    }
  )
);