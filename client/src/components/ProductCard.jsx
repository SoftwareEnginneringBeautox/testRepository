import React from "react";
import { Badge } from "@/components/ui/Badge";

function ProductCard({ product, category }) {
  const getMainPrice = () => {
    if (typeof product.price === "string") {
      return product.price;
    } else if (product.subcategories && product.subcategories.length > 0) {
      return product.subcategories[0].price;
    }
    return "Price on request";
  };

  return (
    <div className="group h-full">
      <div className="relative h-full rounded-xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl"
        style={{
          backgroundColor: '#E5BDF6',
          backgroundImage: 'linear-gradient(45deg, rgba(229, 189, 246, 0.9) 0%, rgba(243, 232, 246, 0.95) 100%)'
        }}>
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
              <Badge className="bg-red-100 hover:bg-red-200 text-red-800 text-xs px-2 py-0.5">
                {product.discount}
              </Badge>
            )}
          </div>

          {/* Content - Middle section with flexible height */}
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

            {/* Subcategories - Reformatted */}
            {product.subcategories && (
              <div className="space-y-4 mb-4">
                {product.subcategories.map((sub, idx) => {
                  // Extract session count if available
                  const sessionMatch =
                    sub.details && sub.details[0]
                      ? sub.details[0].match(/Total of (\d+) Sessions/)
                      : null;
                  const sessionCount = sessionMatch ? sessionMatch[1] : null;

                  // Find corresponding per session price if available
                  const perSessionInfo =
                    product.perSession && Array.isArray(product.perSession)
                      ? product.perSession.find(
                          (s) => s.area === sub.name.split(" ")[0]
                        )
                      : null;

                  return (
                    <div key={idx} className="bg-white/40 rounded-lg p-3">
                      <h4 className="font-medium">
                        {sub.name}{" "}
                        {sessionCount && `(${sessionCount} Sessions)`}
                      </h4>

                      {perSessionInfo && (
                        <p className="text-sm text-gray-700 mt-1">
                          {perSessionInfo.price}
                        </p>
                      )}

                      <p className="text-sm font-semibold mt-1">{sub.price}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Per session pricing - Simplified */}
            {product.perSession && typeof product.perSession === "string" && (
              <div className="text-sm text-gray-700 mb-4">
                <p>{product.perSession}</p>
              </div>
            )}

            {/* Per session pricing as array - Only if not already shown with subcategories */}
            {product.perSession &&
              Array.isArray(product.perSession) &&
              !product.subcategories && (
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium">Per Session:</p>
                  {product.perSession.map((session, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{session.area}:</span>
                      <span className="font-semibold">{session.price}</span>
                    </div>
                  ))}
                </div>
              )}

            {/* Note */}
            {product.note && (
              <p className="text-xs text-red-500 italic mb-4">{product.note}</p>
            )}
          </div>

          {/* Footer with price - Redesigned to be more seamless */}
          <div className="mt-auto pt-4 flex justify-end">
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">
                {getMainPrice()}
              </p>
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
