import { MESSAGES } from '@/features/sukang/constants/messages'
import { PRINT_BUTTON_LABELS } from '@/features/sukang/constants/screens'
import { dialog } from '@/shared/lib/dialog'
import { handleActivateKey } from '@/shared/lib/keyboard'

export function PrintButtons() {
  const handlePrint = () => dialog.alert(MESSAGES.PRINT_UNSUPPORTED)
  const onKeyDown = handleActivateKey<HTMLAnchorElement>(handlePrint)

  return (
    <div className="tit_btns">
      <a
        className="btn_regiP"
        role="button"
        tabIndex={0}
        onClick={handlePrint}
        onKeyDown={onKeyDown}
      >
        {PRINT_BUTTON_LABELS.check.ko} {PRINT_BUTTON_LABELS.check.en}
      </a>{' '}
      <a
        className="btn_scheP"
        role="button"
        tabIndex={0}
        onClick={handlePrint}
        onKeyDown={onKeyDown}
      >
        {PRINT_BUTTON_LABELS.apply.ko} {PRINT_BUTTON_LABELS.apply.en}
      </a>
    </div>
  )
}
