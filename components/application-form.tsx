import type { ApplicationField } from "@/lib/application-fields";
import { submitApplication } from "@/app/actions/applications";

export function ApplicationForm({
  applicationTypeId,
  slug,
  fields
}: {
  applicationTypeId: string;
  slug: string;
  fields: ApplicationField[];
}) {
  return (
    <form action={submitApplication} className="form-stack">
      <input type="hidden" name="applicationTypeId" value={applicationTypeId} />
      <input type="hidden" name="slug" value={slug} />

      {fields.map((field) => (
        <div className="form-group" key={field.id}>
          <label htmlFor={field.id}>
            {field.label}
            {field.required && <span className="required"> *</span>}
          </label>

          {field.type === "textarea" ? (
            <textarea
              id={field.id}
              name={field.id}
              required={field.required}
              placeholder={field.placeholder}
              minLength={field.minLength}
              maxLength={field.maxLength}
              rows={6}
            />
          ) : field.type === "select" ? (
            <select id={field.id} name={field.id} required={field.required}>
              <option value="">Choose an option</option>
              {field.options?.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : field.type === "checkbox" ? (
            <label className="checkbox-row">
              <input id={field.id} name={field.id} type="checkbox" />
              <span>{field.helperText || "I confirm this statement."}</span>
            </label>
          ) : (
            <input
              id={field.id}
              name={field.id}
              type={field.type}
              required={field.required}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              minLength={field.minLength}
              maxLength={field.maxLength}
            />
          )}

          {field.helperText && field.type !== "checkbox" && (
            <small className="field-help">{field.helperText}</small>
          )}
        </div>
      ))}

      <div className="form-notice">
        By submitting, you confirm the information is accurate and understand
        that staff may contact you through Discord.
      </div>

      <button className="button" type="submit">
        Submit application
      </button>
    </form>
  );
}
