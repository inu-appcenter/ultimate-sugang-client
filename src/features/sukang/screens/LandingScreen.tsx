import { GuideBox } from '@/features/sukang/components/GuideBox'
import { SCREEN_NOTICES } from '@/features/sukang/constants/notices'

export function LandingScreen() {
  return <GuideBox lines={SCREEN_NOTICES.Jungong ?? []} />
}
