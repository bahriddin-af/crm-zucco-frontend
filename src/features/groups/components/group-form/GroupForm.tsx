import { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/i18n'
import { useAuthStore } from '@/stores/authStore'
import { todayIsoDate } from '@/utils/dateUtils'
import type { GroupResponse } from '../../types/groupTypes'
import { useSaveGroup } from '../../hooks/useGroups'
import {
  createDefaultGroupValues,
  createGroupSchema,
  groupToFormValues,
  toGroupRequest,
  type GroupFormValues,
} from '../../utils/groupFormSchema'
import { GroupAssignmentFields } from './GroupAssignmentFields'
import { GroupScheduleFields } from './GroupScheduleFields'
import { GroupBillingFields } from './GroupBillingFields'

interface GroupFormProps {
  group?: GroupResponse
  onCancel: () => void
  onSaved: () => void
}

export function GroupForm({ group, onCancel, onSaved }: GroupFormProps) {
  const { t } = useTranslation()
  const activeBranchId = useAuthStore((state) => state.activeBranchId)
  const [today] = useState(todayIsoDate)
  const schema = useMemo(() => createGroupSchema(t), [t])

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: group ? groupToFormValues(group) : createDefaultGroupValues(activeBranchId ?? '', today),
  })
  const saveMutation = useSaveGroup(onSaved)

  const onSubmit = form.handleSubmit((values) => {
    saveMutation.mutate(toGroupRequest(values, group?.id))
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <GroupAssignmentFields isEditing={Boolean(group)} />
        <GroupScheduleFields />
        <GroupBillingFields />

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t.common.cancel}
          </Button>
          <Button type="submit" variant="primary" isLoading={saveMutation.isPending}>
            {group ? t.common.save : t.groups.submitCreate}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
