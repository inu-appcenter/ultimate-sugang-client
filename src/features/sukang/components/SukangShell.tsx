import { useSearchParams } from 'react-router-dom'
import { EnrollmentArea } from '@/features/sukang/components/EnrollmentArea'
import { MenuTabs } from '@/features/sukang/components/MenuTabs'
import { PerTable } from '@/features/sukang/components/PerTable'
import { toScreenKey, type ScreenKey } from '@/features/sukang/constants/screens'
import { BasketScreen } from '@/features/sukang/screens/BasketScreen'
import { CustomScreen } from '@/features/sukang/screens/CustomScreen'
import { GyoyangScreen } from '@/features/sukang/screens/GyoyangScreen'
import { HussScreen } from '@/features/sukang/screens/HussScreen'
import { JungongScreen } from '@/features/sukang/screens/JungongScreen'
import { LandingScreen } from '@/features/sukang/screens/LandingScreen'
import { TagwaScreen } from '@/features/sukang/screens/TagwaScreen'
import { YungaeScreen } from '@/features/sukang/screens/YungaeScreen'
import { MENU_QUERY } from '@/shared/constants/routes'

function CurrentScreen({ screen }: { screen: ScreenKey | null }) {
  switch (screen) {
    case null:
      return <LandingScreen />
    case 'Basket':
      return <BasketScreen />
    case 'Jungong':
      return <JungongScreen />
    case 'Gyoyang':
      return <GyoyangScreen />
    case 'Tagwa':
      return <TagwaScreen />
    case 'Yungae':
      return <YungaeScreen />
    case 'Huss':
      return <HussScreen />
    case 'Custom':
      return <CustomScreen />
  }
}

export function SukangShell() {
  const [params, setParams] = useSearchParams()
  const screen = toScreenKey(params.get(MENU_QUERY))

  return (
    <div className="wrap">
      <PerTable />
      <MenuTabs onSelect={(key) => setParams({ [MENU_QUERY]: key })} />
      <CurrentScreen key={screen ?? 'landing'} screen={screen} />
      <EnrollmentArea />
    </div>
  )
}
