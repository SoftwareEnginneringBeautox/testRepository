import React from "react";
import { Badge } from "@/components/ui/Badge";

function ProductCard({ product, category }) {
  const getMainPrice = () => {
    if (
      product.name === "Intimate Secret" ||
      product.name === "Vampire Facial Package"
    ) {
      if (typeof product.perSession === "string") {
        return product.perSession;
      }
      if (Array.isArray(product.perSession) && product.perSession.length > 0) {
        const first = product.perSession[0];
        return typeof first === "string" ? first : first.price;
      }
      if (product.subcategories?.[0]?.perSession) {
        return product.subcategories[0].perSession;
      }
      return "";
    }

    if (typeof product.price === "string") {
      return product.price;
    } else if (product.subcategories?.[0]?.price) {
      return product.subcategories[0].price;
    }

    return "Price on request";
  };

  const getTotalPrice = () => {
    if (product.name === "Diode Laser" || product.name === "Intimate Secret") {
      return null;
    }
    return getMainPrice();
  };

  return (
    <div className="group h-full">
      <div
        className="relative h-full rounded-xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl"
        style={{
          backgroundColor: "#E5BDF6",
          backgroundImage:
            "linear-gradient(45deg, rgba(229, 189, 246, 0.9) 0%, rgba(243, 232, 246, 0.95) 100%)",
        }}
      >
        <div className="relative z-10 p-6 flex flex-col h-full">
          {/* Header */}
          <div className="mb-4 flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold">{product.name}</h3>
              {category && (
                <span className="text-xs font-medium text-purple-700 block mt-1">
                  {category}
                </span>
              )}
            </div>

            {product.discount && (
              <div className="absolute -right-[2px] -top-[2px]">
                <div className="bg-red-100 text-red-800 text-xs px-3 py-1.5 rounded-tr-xl rounded-bl-xl font-medium">
                  {product.discount}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-grow">
            {/* Details list */}
            {product.details && (
              <div className="space-y-2 mb-4">
                {product.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/40 flex items-center justify-center text-xs text-purple-700">
                      ✓
                    </div>
                    <p className="text-sm">{detail}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Subcategories */}
            {product.subcategories && (
              <div className="space-y-4 mb-4">
                {product.subcategories.map((sub, idx) => (
                  <div
                    key={idx}
                    className="bg-white/40 rounded-lg p-3 relative flex flex-col justify-between min-h-[100px]"
                  >
                    <div>
                      <h4 className="text-base font-semibold">{sub.name}</h4>
                      {sub.perSession && (
                        <p className="text-gray-600 mt-1 text-sm">
                          Per Session: {sub.perSession}
                        </p>
                      )}
                      {product.name !== "Diode Laser" && sub.details && (
                        <ul className="text-sm text-gray-600 mt-1 list-disc list-inside">
                          {sub.details.map((detail, i) => (
                            <li key={i}>{detail}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {sub.price && (
                      <div className="self-end text-base font-bold text-gray-900 text-right mt-1">
                        <span>{sub.price}</span>
                        {sub.details?.[0] && (
                          <span className="ml-1">({sub.details[0]})</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Note */}
            {product.note && (
              <p className="text-xs text-red-500 italic mb-4">{product.note}</p>
            )}
          </div>

          {/* Footer Price */}
          <div className="mt-auto pt-4 flex justify-end">
            <div className="text-right">
              {product.discountedFrom && (
                <p className="text-sm text-red-500 mb-1">
                  Discounted from {product.discountedFrom}
                </p>
              )}
              {getTotalPrice() && (
                <p className="text-xl font-bold text-gray-900">
                  {getTotalPrice()}
                </p>
              )}
              {product.package && (
                <p className="text-xs text-gray-600">{product.package}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
