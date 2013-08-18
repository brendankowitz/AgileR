using System.Data;
using System.Web.Http.Filters;
using System.Web.Mvc;
using AgileR.Web.Intrastructure.Data;
using ActionFilterAttribute = System.Web.Http.Filters.ActionFilterAttribute;

namespace AgileR.Web.Intrastructure.Filters
{
    public class TransactionFilter : ActionFilterAttribute
    {
        private IDbTransaction _trans;

        public override void OnActionExecuting(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            var context = DependencyResolver.Current.GetService<IDbContext>();

            _trans = context.BeginTransaction();

            base.OnActionExecuting(actionContext);
        }

        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            if(_trans != null)
                _trans.Commit();
            _trans = null;

            base.OnActionExecuted(actionExecutedContext);
        }
    }
}