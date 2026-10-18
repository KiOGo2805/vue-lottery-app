<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";

defineOptions({ inheritAttrs: false });

defineProps<{
  value: readonly object[];
  columns: readonly {
    field?: string;
    header: string;
    headerClass?: string;
    slot?: string;
  }[];
}>();
</script>

<template>
  <DataTable v-bind="$attrs" :value="value" unstyled>
    <template #empty>
      <slot name="empty">Даних не знайдено</slot>
    </template>
    <Column
      v-for="column in columns"
      :key="column.header"
      :field="column.field"
      :header="column.header"
      :header-class="column.headerClass"
    >
      <template v-if="column.slot" #body="slotProps">
        <slot :name="column.slot" v-bind="slotProps" />
      </template>
    </Column>
  </DataTable>
</template>

<style>
.app-table {
  width: 100%;
  overflow-x: auto;
}

.app-table table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.app-table th,
.app-table td {
  padding: 0.5rem;
}

.app-table thead tr,
.app-table tbody tr {
  border-bottom: 1px solid #e5e7eb;
}

.app-table thead tr {
  color: #4b5563;
  font-size: 0.875rem;
}

.app-table .users-view__actions-heading {
  width: 240px;
  padding-right: 1rem;
  text-align: right;
}

.app-table tbody tr:hover {
  background-color: #f9fafb;
}

.app-table tbody td {
  padding-top: 0.75rem;
}

.app-dark .app-table thead tr,
.app-dark .app-table tbody tr {
  border-color: #374151;
}

.app-dark .app-table thead tr {
  color: #cbd5e1;
}

.app-dark .app-table tbody tr:hover {
  background-color: #374151;
}
</style>
