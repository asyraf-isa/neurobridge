import Icon from "@/components/common/Icon.jsx";
import { STRENGTH_NOTES } from "@/data/support-profile.js";
import { fieldText } from "./profile-fields.js";

/**
 * "Preview employer view": a read-only list of exactly the fields the manager
 * can see, plus a count of the private fields they can't.
 */
function EmployerPreview({ sections, isVisible, managerName }) {
  const shown = sections
    .map((section) => {
      const fields = section.fields
        .filter(isVisible)
        .map((f) => ({ label: f.label.toUpperCase(), text: fieldText(f, ", ") }))
        .filter((f) => f.text);
      if (section.k === "strengths") {
        fields.push(...STRENGTH_NOTES.map((n) => ({ label: `FROM ${n.from.toUpperCase()}`, text: n.text })));
      }
      return { k: section.k, title: section.title, fields };
    })
    .filter((section) => section.fields.length);
  const hidden = sections.flatMap((s) => s.fields).filter((f) => !isVisible(f)).length;

  return (
    <>
      <div className="flex max-w-[53.75rem] items-center gap-3 rounded-panel bg-tint-indigo-soft px-5 py-3.5 text-body-lg" role="status">
        <Icon name="visibility" fill className="text-[20px] text-primary" />
        This is exactly what {managerName} sees. Private fields are not shown.
      </div>
      <div className="flex max-w-[53.75rem] flex-col gap-4">
        {shown.map((section) => (
          <section key={section.k} className="flex flex-col gap-3 rounded-card-sm border border-divider bg-surface-container-lowest px-6 py-[1.375rem]">
            <h2 className="m-0 text-[1.25rem] font-extrabold">{section.title}</h2>
            {section.fields.map((field) => (
              <div key={field.label} className="flex flex-col gap-1">
                <span className="text-body-sm font-extrabold tracking-[0.06em] text-slate">{field.label}</span>
                <span className="text-body-lg">{field.text}</span>
              </div>
            ))}
          </section>
        ))}
        <div className="flex items-center gap-3 rounded-3xl border-[1.5px] border-dashed border-muted-border px-[1.375rem] py-[1.125rem] text-body-lg text-slate">
          <Icon name="lock" fill className="text-[22px]" />
          {hidden} private field{hidden === 1 ? " is" : "s are"} not shown to {managerName}.
        </div>
      </div>
    </>
  );
}

export default EmployerPreview;
