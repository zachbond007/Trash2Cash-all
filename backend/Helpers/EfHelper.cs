using System;
using System.Linq.Expressions;

namespace trash2cash_backend.Helpers
{
	public static class EfHelper
	{
            public static IQueryable<TEntity> OrderBy<TEntity>(this IQueryable<TEntity> source, string orderByProperty,
                          bool desc)
            {
            try
            {
                string command = desc ? "OrderByDescending" : "OrderBy";
                var type = typeof(TEntity);
                if (orderByProperty != null)
                {
                    var property = type.GetProperty(string.Concat(orderByProperty[0].ToString().ToUpper(), orderByProperty.AsSpan(1)));
                    var parameter = Expression.Parameter(type, "p");
                    var propertyAccess = Expression.MakeMemberAccess(parameter, property);
                    var orderByExpression = Expression.Lambda(propertyAccess, parameter);
                    var resultExpression = Expression.Call(typeof(Queryable), command, new Type[] { type, property.PropertyType },
                                                  source.Expression, Expression.Quote(orderByExpression));
                    return source.Provider.CreateQuery<TEntity>(resultExpression);
                }
                return source;

            }
            catch (Exception ex)
            {
                return source;
            }
        }

        public static IQueryable<T> ConditionalWhere<T>(
        this IQueryable<T> source,
        Func<bool> condition,
        Expression<Func<T, bool>> predicate)
        {
            if (condition())
            {
                return source.Where(predicate);
            }

            return source;
        }
    }

}

