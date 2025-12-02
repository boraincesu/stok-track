export function SettingsPage() {
  return (
    <section className="flex max-w-4xl flex-col gap-8">
      <header>
        <h2 className="text-xl font-bold text-text-light-primary dark:text-dark-primary">
          Settings
        </h2>
        <p className="text-sm text-text-light-secondary dark:text-dark-secondary">
          Manage your profile, alerts, and workspace preferences.
        </p>
      </header>

      <article className="rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-text-light-primary dark:text-dark-primary">
          Profile Information
        </h3>
        <div className="mt-6 flex flex-col gap-8 md:flex-row">
          <div className="relative">
            <div
              className="size-24 rounded-full bg-cover bg-center"
              style={{
                backgroundImage: 'url("https://i.pravatar.cc/120?img=12")',
              }}
            />
            <button
              type="button"
              className="absolute bottom-0 right-0 rounded-full bg-primary text-white p-1.5 shadow-lg hover:bg-primary/90 transition"
              aria-label="Edit avatar"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                label: "Full Name",
                type: "text",
                defaultValue: "Olivia Rhye",
              },
              {
                label: "Email Address",
                type: "email",
                defaultValue: "olivia@example.com",
              },
              {
                label: "Phone Number",
                type: "tel",
                defaultValue: "+1 (555) 123-4567",
              },
              {
                label: "Role",
                type: "text",
                defaultValue: "Administrator",
                disabled: true,
              },
            ].map((field) => (
              <label
                key={field.label}
                className="flex flex-col gap-2 text-sm font-semibold text-text-light-primary dark:text-dark-primary"
              >
                {field.label}
                <input
                  className={`rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-3 py-2 text-sm font-normal text-text-light-primary dark:text-dark-primary outline-none transition focus:border-primary focus:ring-1 focus:ring-primary ${
                    field.disabled
                      ? "cursor-not-allowed text-text-light-secondary"
                      : ""
                  }`}
                  defaultValue={field.defaultValue}
                  disabled={field.disabled}
                  type={field.type}
                />
              </label>
            ))}
            <div className="md:col-span-2 flex justify-end">
              <button
                type="button"
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-text-light-primary dark:text-dark-primary">
          Notifications
        </h3>
        <div className="mt-6 space-y-4">
          {[
            {
              title: "Order Alerts",
              description: "Get notified when a new order is placed.",
              defaultChecked: true,
            },
            {
              title: "Low Stock Warnings",
              description: "Receive alerts when inventory drops below targets.",
              defaultChecked: true,
            },
            {
              title: "Weekly Reports",
              description: "Receive a weekly summary of sales and inventory.",
              defaultChecked: false,
            },
          ].map((item, index) => (
            <div
              key={item.title}
              className={`flex items-center justify-between py-3 ${
                index === 0
                  ? ""
                  : "border-t border-border-light dark:border-border-dark"
              }`}
            >
              <div>
                <p className="font-medium text-text-light-primary dark:text-dark-primary">
                  {item.title}
                </p>
                <p className="text-sm text-text-light-secondary dark:text-dark-secondary">
                  {item.description}
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  defaultChecked={item.defaultChecked}
                  type="checkbox"
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-border-light transition peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 dark:bg-border-dark">
                  <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5 peer-checked:bg-primary" />
                </div>
              </label>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
