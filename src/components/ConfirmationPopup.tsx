"use client";

interface PendingEntry {
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_time: "dimineata" | "amiaza" | "seara";
  date: string;
}

interface ConfirmationPopupProps {
  entries: PendingEntry[];
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationPopup({
  entries,
  onConfirm,
  onCancel,
}: ConfirmationPopupProps) {
  const mealTimeLabels = {
    dimineata: "🌅 Dimineața",
    amiaza: "☀️ La amiază",
    seara: "🌙 Seara",
  };

  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalProtein = entries.reduce((sum, entry) => sum + entry.protein, 0);
  const totalCarbs = entries.reduce((sum, entry) => sum + entry.carbs, 0);
  const totalFat = entries.reduce((sum, entry) => sum + entry.fat, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Confirmă intrările în jurnal
          </h2>
          <p className="text-gray-600">
            Am detectat {entries.length} element{entries.length > 1 ? "e" : ""}{" "}
            de mâncare. Verifică și confirmă pentru a le adăuga în jurnalul tău.
          </p>
        </div>

        {/* Entries List */}
        <div className="p-6 space-y-4">
          {entries.map((entry, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-800 text-lg">
                    {entry.food_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {mealTimeLabels[entry.meal_time]} •{" "}
                    {new Date(entry.date).toLocaleDateString("ro-RO")}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    {Math.round(entry.calories)} kcal
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-gray-600">Proteine</div>
                  <div className="font-medium text-red-600">
                    {Math.round(entry.protein * 10) / 10}g
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">Carbohidrați</div>
                  <div className="font-medium text-yellow-600">
                    {Math.round(entry.carbs * 10) / 10}g
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">Grăsimi</div>
                  <div className="font-medium text-green-600">
                    {Math.round(entry.fat * 10) / 10}g
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        {entries.length > 1 && (
          <div className="px-6 pb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-3">
                Total pentru această sesiune:
              </h4>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(totalCalories)}
                  </div>
                  <div className="text-sm text-blue-600">kcal</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-red-600">
                    {Math.round(totalProtein * 10) / 10}g
                  </div>
                  <div className="text-sm text-red-600">Proteine</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-yellow-600">
                    {Math.round(totalCarbs * 10) / 10}g
                  </div>
                  <div className="text-sm text-yellow-600">Carbohidrați</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-600">
                    {Math.round(totalFat * 10) / 10}g
                  </div>
                  <div className="text-sm text-green-600">Grăsimi</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6 border-t bg-gray-50 flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Anulează
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ✅ Confirmă și adaugă în jurnal
          </button>
        </div>
      </div>
    </div>
  );
}
