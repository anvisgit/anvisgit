import { useProjectStore } from '@/stores/projectStore'
import { publicAssetUrl } from '@/composables/usePublicAssetUrl'
export const path = () => {
  return publicAssetUrl('project_images/') + useProjectStore().selectedData?.ressourcespath
}
