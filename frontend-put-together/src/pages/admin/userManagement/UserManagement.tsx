import UserManagementSidebar from "./UserManagementSidebar";
import UserDetailsCard from "./UserDetailsCard";
import UserActionsCard from "./UserActionsCard";
import CourseAccessModal from "./CourseAccessModal";
import UserManagementEmptyState from "./UserManagementEmptyState";
import { useUserManagementPage } from "./useUserManagementPage";

export default function UserManagement() {
  const {
    loading,
    selected,
    details,
    loadingDetails,
    search,
    roleFilter,
    error,
    actionBusy,
    roleDraft,
    pwDraft,
    pwRepeat,
    showPwNew,
    showPwRepeat,
    accessModalOpen,
    accessMode,
    activeCourses,
    accessLoading,
    accessBusy,
    accessError,
    courseQuery,
    checkedCourseIds,
    availableRoles,
    filteredUsers,
    stats,
    selectedInitial,
    isTargetAdmin,
    isTargetStudent,
    isActive,
    pwTooShort,
    pwMismatch,
    canResetPw,
    activeCourseIdSet,
    visibleList,
    activeVisibleCount,
    actionableSelectedCount,
    users,

    setSelected,
    setSearch,
    setRoleFilter,
    setRoleDraft,
    setPwDraft,
    setPwRepeat,
    setShowPwNew,
    setShowPwRepeat,
    setAccessMode,
    setCourseQuery,
    setCheckedCourseIds,

    loadUsers,
    openAccessModal,
    closeAccessModal,
    toggleChecked,
    submitAccessChanges,
    runAction,

    formatDate,
  } = useUserManagementPage();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-lila-600" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <UserManagementSidebar
        users={users}
        filteredUsers={filteredUsers}
        selected={selected}
        search={search}
        roleFilter={roleFilter}
        availableRoles={availableRoles}
        error={error}
        stats={stats}
        onSearchChange={setSearch}
        onRoleFilterChange={setRoleFilter}
        onReload={() => loadUsers(true)}
        onSelect={setSelected}
      />

      <section className="lg:col-span-8 space-y-6">
        {!selected ? (
          <UserManagementEmptyState />
        ) : (
          <>
            <UserDetailsCard
              selected={selected}
              details={details}
              loadingDetails={loadingDetails}
              selectedInitial={selectedInitial}
              isActive={isActive}
              onCopyId={async () => navigator.clipboard.writeText(selected.id)}
              onCopyEmail={async () => navigator.clipboard.writeText(selected.email)}
              onOpenAccessModal={openAccessModal}
              showAccessButton={isTargetStudent}
              actionBusy={actionBusy}
              formatDate={formatDate}
            />

            <UserActionsCard
              loadingDetails={loadingDetails}
              actionBusy={actionBusy}
              isTargetAdmin={isTargetAdmin}
              isActive={isActive}
              roleDraft={roleDraft}
              onRoleDraftChange={setRoleDraft}
              onSaveRole={() =>
                runAction(async () => {
                  if (!selected?.id) return;
                  await import("../../../services/userService").then(({ updateUserRole }) =>
                    updateUserRole(selected.id, roleDraft)
                  );
                })
              }
              onDeactivate={() =>
                runAction(async () => {
                  if (!selected?.id) return;
                  await import("../../../services/userService").then(({ deactivateUser }) =>
                    deactivateUser(selected.id)
                  );
                })
              }
              onActivate={() =>
                runAction(async () => {
                  if (!selected?.id) return;
                  await import("../../../services/userService").then(({ activateUser }) =>
                    activateUser(selected.id)
                  );
                })
              }
              pwDraft={pwDraft}
              pwRepeat={pwRepeat}
              onPwDraftChange={setPwDraft}
              onPwRepeatChange={setPwRepeat}
              showPwNew={showPwNew}
              showPwRepeat={showPwRepeat}
              onToggleShowPwNew={() => setShowPwNew((s) => !s)}
              onToggleShowPwRepeat={() => setShowPwRepeat((s) => !s)}
              canResetPw={canResetPw}
              pwTooShort={pwTooShort}
              pwMismatch={pwMismatch}
              onResetPassword={() =>
                runAction(async () => {
                  if (!selected?.id) return;
                  await import("../../../services/userService").then(({ resetUserPassword }) =>
                    resetUserPassword(selected.id, pwDraft.trim())
                  );
                  setPwDraft("");
                  setPwRepeat("");
                  setShowPwNew(false);
                  setShowPwRepeat(false);
                })
              }
            />
          </>
        )}
      </section>

      <CourseAccessModal
        isOpen={accessModalOpen}
        selected={selected}
        currentRoleName={details?.roleName ?? selected?.roleName}
        isTargetStudent={isTargetStudent}
        accessMode={accessMode}
        accessLoading={accessLoading}
        accessBusy={accessBusy}
        accessError={accessError}
        courseQuery={courseQuery}
        visibleList={visibleList}
        activeCourses={activeCourses}
        activeCourseIdSet={activeCourseIdSet}
        checkedCourseIds={checkedCourseIds}
        actionableSelectedCount={actionableSelectedCount}
        activeVisibleCount={activeVisibleCount}
        onClose={closeAccessModal}
        onModeChange={(mode) => {
          setAccessMode(mode);
          setCheckedCourseIds(new Set<string>());
          setCourseQuery("");
        }}
        onCourseQueryChange={setCourseQuery}
        onToggleChecked={toggleChecked}
        onSubmit={submitAccessChanges}
      />
    </div>
  );
}