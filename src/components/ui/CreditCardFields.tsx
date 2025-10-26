import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "../ui/field";

interface CreditCardFormProps {
  onSubmit: (data: {
    name: string;
    cardNumber: string;
    expMonth: string;
    expYear: string;
    cvv: string;
  }) => void;
  loading?: boolean;
}

export default function CreditCardForm({ onSubmit, loading }: CreditCardFormProps) {
  const [form, setForm] = useState({
    name: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvv: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md font-quicksand">
      <FieldGroup>
        <FieldSet>
          <FieldLegend className="text-lg font-semibold mb-2">Método de pago</FieldLegend>
          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel>Nombre en la tarjeta</FieldLabel>
              <Input
                name="name"
                placeholder="Nombre completo"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Field>
            <Field>
              <FieldLabel>Número de tarjeta</FieldLabel>
              <Input
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={form.cardNumber}
                onChange={handleChange}
                required
              />
            </Field>

            <div className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel>Mes</FieldLabel>
                <Select
                  onValueChange={(v) => handleSelect("expMonth", v)}
                  value={form.expMonth}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                        {String(i + 1).padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Año</FieldLabel>
                <Select
                  onValueChange={(v) => handleSelect("expYear", v)}
                  value={form.expYear}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="YYYY" />
                  </SelectTrigger>
                  <SelectContent>
                    {["2024", "2025", "2026", "2027", "2028"].map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>CVV</FieldLabel>
                <Input
                  name="cvv"
                  placeholder="123"
                  value={form.cvv}
                  onChange={handleChange}
                  required
                />
              </Field>
            </div>
          </div>
        </FieldSet>

        <div className="pt-6">
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-contrast-secondary hover:bg-main text-white"
          >
            {loading ? "Procesando..." : "Pagar ahora"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
