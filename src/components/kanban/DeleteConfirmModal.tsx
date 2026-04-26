import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface DeleteConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  taskTitle: string
  isLoading?: boolean
}

export function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  taskTitle,
  isLoading = false,
}: DeleteConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Excluir tarefa" size="sm">
      <div className="space-y-5">
        <p className="text-sm text-gray-600 leading-relaxed">
          Tem certeza que deseja excluir{' '}
          <span className="font-semibold text-gray-900">"{taskTitle}"</span>?
          {' '}Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="danger" loading={isLoading} onClick={onConfirm}>
            Excluir
          </Button>
        </div>
      </div>
    </Modal>
  )
}
