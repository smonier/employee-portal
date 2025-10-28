import { jahiaComponent } from "@jahia/javascript-modules-library";
import data from "../../data/hrMockData.json" assert { type: "json" };
import classes from "./component.module.css";
import type { HrInsightsProps, HrMockData, HrCategory, EmployeeRecord } from "./types";
import { t } from "i18next";
import type { RenderContext } from "org.jahia.services.render";

const hrData = data as HrMockData;
const FALLBACK_TITLE = "HR Insights";
const CATEGORY_LABELS: Record<HrCategory, string> = {
  payslips: "Payslips Overview",
  vacations: "Vacation Balances",
  expenses: "Monthly Expenses",
};

const CATEGORY_DESCRIPTIONS: Record<HrCategory, string> = {
  payslips:
    "Aggregated payroll information for the last twelve months across the HR team.",
  vacations:
    "Real-time snapshot of vacation balances and current year usage.",
  expenses:
    "Expense claims grouped by category for the previous month.",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);

const renderPayslips = (employees: EmployeeRecord[]) => (
  <div className={classes.tableWrapper}>
    <table className={classes.table}>
      <thead>
        <tr>
          <th>{t("hrInsights.table.employee", "Employee")}</th>
          <th>{t("hrInsights.table.date", "Date")}</th>
          <th className={classes.numeric}>{t("hrInsights.table.gross", "Gross")}</th>
          <th className={classes.numeric}>{t("hrInsights.table.net", "Net")}</th>
          <th className={classes.numeric}>{t("hrInsights.table.bonuses", "Bonuses")}</th>
          <th className={classes.numeric}>{t("hrInsights.table.deductions", "Deductions")}</th>
          <th>{t("hrInsights.table.currency", "Currency")}</th>
          <th>{t("hrInsights.table.department", "Department")}</th>
        </tr>
      </thead>
      <tbody>
        {employees.flatMap((employee) =>
          employee.payslips.map((slip) => (
            <tr key={`${employee.name}-${slip.date}`}>
              <td>{employee.name}</td>
              <td>{slip.date}</td>
              <td className={classes.numeric}>{formatCurrency(slip.grossSalary)}</td>
              <td className={classes.numeric}>{formatCurrency(slip.netSalary)}</td>
              <td className={classes.numeric}>
                {slip.bonuses ? formatCurrency(slip.bonuses) : "—"}
              </td>
              <td className={classes.numeric}>{formatCurrency(slip.deductions)}</td>
              <td>{slip.currency}</td>
              <td>{slip.department}</td>
            </tr>
          )),
        )}
      </tbody>
    </table>
  </div>
);

const renderVacations = (employees: EmployeeRecord[]) => (
  <div className={classes.summaryGrid}>
    {employees.map((employee) => {
      const summary = employee.vacations;
      return (
        <article className={classes.card} key={employee.name}>
          <header className={classes.cardHeader}>
            <div>
              <h3 className={classes.cardTitle}>{employee.name}</h3>
              <div className={classes.metricLabel}>{employee.department}</div>
            </div>
            <span className={classes.chip}>{t("hrInsights.badge.snapshot", "Snapshot")}</span>
          </header>

          <div className={classes.metricRow}>
            <div className={classes.metric}>
              <span className={classes.metricLabel}>{t("hrInsights.metric.totalAvailable", "Total available")}</span>
              <span className={classes.metricValue}>{summary.totalDaysAvailable}d</span>
            </div>
            <div className={classes.metric}>
              <span className={classes.metricLabel}>{t("hrInsights.metric.taken", "Taken")}</span>
              <span className={classes.metricValue}>{summary.totalDaysTaken}d</span>
            </div>
            <div className={classes.metric}>
              <span className={classes.metricLabel}>{t("hrInsights.metric.remaining", "Remaining")}</span>
              <span className={classes.metricValue}>{summary.remainingDays}d</span>
            </div>
          </div>

          <section className={classes.subSection}>
            <h4 className={classes.subSectionTitle}>{t("hrInsights.leaves", "This year's leaves")}</h4>
            {summary.vacationsTaken.length === 0 ? (
              <p className={classes.emptyState}>{t("hrInsights.empty", "No data available.")}</p>
            ) : (
              <div className={classes.tableWrapper}>
                <table className={classes.table}>
                  <thead>
                    <tr>
                      <th>{t("hrInsights.table.type", "Type")}</th>
                      <th>{t("hrInsights.table.start", "Start")}</th>
                      <th>{t("hrInsights.table.end", "End")}</th>
                      <th className={classes.numeric}>{t("hrInsights.table.duration", "Duration")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.vacationsTaken.map((vacation) => (
                      <tr
                        key={`${employee.name}-${vacation.startDate}-${vacation.endDate}`}
                      >
                        <td>{vacation.type}</td>
                        <td>{vacation.startDate}</td>
                        <td>{vacation.endDate}</td>
                        <td className={classes.numeric}>{vacation.durationDays}d</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </article>
      );
    })}
  </div>
);

const renderExpenses = (employees: EmployeeRecord[]) => (
  <div className={classes.summaryGrid}>
    {employees.map((employee) => {
      const expenses = employee.expenses;
      return (
        <article className={classes.card} key={employee.name}>
          <header className={classes.cardHeader}>
            <div>
              <h3 className={classes.cardTitle}>{employee.name}</h3>
              <div className={classes.metricLabel}>
                {employee.department} · {expenses.month}
              </div>
            </div>
            <span className={classes.chip}>{formatCurrency(expenses.totalAmount)}</span>
          </header>

          <section className={classes.expenseCategories}>
            {expenses.categories.map((category) => {
              const categoryTotal = category.items.reduce(
                (sum, item) => sum + item.amount,
                0,
              );
              return (
                <div key={`${employee.name}-${category.name}`}>
                  <div className={classes.categoryHeader}>
                    <span>{category.name}</span>
                    <span className={classes.categoryTotal}>
                      {formatCurrency(categoryTotal)}
                    </span>
                  </div>
                  <div className={classes.tableWrapper}>
                    <table className={classes.table}>
                      <thead>
                        <tr>
                          <th>{t("hrInsights.table.date", "Date")}</th>
                          <th>{t("hrInsights.table.description", "Description")}</th>
                          <th>{t("hrInsights.table.payment", "Payment")}</th>
                          <th className={classes.numeric}>{t("hrInsights.table.amount", "Amount")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.items.map((item) => (
                          <tr key={`${employee.name}-${category.name}-${item.date}-${item.description}`}>
                            <td>{item.date}</td>
                            <td>{item.description}</td>
                            <td>{item.paymentMethod}</td>
                            <td className={classes.numeric}>{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </section>
        </article>
      );
    })}
  </div>
);

const renderCategory = (category: HrCategory, employees: EmployeeRecord[]) => {
  switch (category) {
    case "vacations":
      return renderVacations(employees);
    case "expenses":
      return renderExpenses(employees);
    case "payslips":
    default:
      return renderPayslips(employees);
  }
};

jahiaComponent(
  {
    componentType: "view",
    nodeType: "jempnt:hrInsights",
    name: "default",
    displayName: "HR Insights",
  },
  (props: HrInsightsProps, { renderContext }: { renderContext: RenderContext }) => {
    const category = (props["jemp:category"] || "payslips") as HrCategory;
    const title = props["jcr:title"] || CATEGORY_LABELS[category] || FALLBACK_TITLE;
    const description =
      props["jemp:description"] || CATEGORY_DESCRIPTIONS[category] || "";

    const jahiaUser = typeof renderContext.getUser === "function" ? renderContext.getUser() : null;
    const userWithName = jahiaUser as unknown as { getName?: () => string } | null;
    const rawName =
      userWithName && typeof userWithName.getName === "function"
        ? userWithName.getName()
        : undefined;

    const normalizedName = rawName ? rawName.trim().toLowerCase() : undefined;
    const employeesToShow = normalizedName
      ? hrData.employees.filter((employee) => employee.name.toLowerCase() === normalizedName)
      : hrData.employees;

    return (
      <section className={classes.root}>
        <header className={classes.header}>
          <h2 className={classes.title}>{title}</h2>
          {description && (
            <div
              className={classes.description}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
          <div className={classes.toolbar}>
            <span className={classes.badge}>{category.toUpperCase()}</span>
            <span className={classes.metricLabel}>
              {employeesToShow.length} employees · {t("hrInsights.updatedOn", {
                date: new Date().toISOString().split("T")[0],
              })}
            </span>
          </div>
        </header>

        {employeesToShow.length === 0 ? (
          <div className={classes.emptyState}>{t("hrInsights.empty", "No data available.")}</div>
        ) : (
          renderCategory(category, employeesToShow)
        )}
      </section>
    );
  },
);
