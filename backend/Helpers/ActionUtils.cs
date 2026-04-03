using System;
namespace trash2cash_backend.Helpers
{
	public static class ActionUtils
	{
		public static string ItemSizeToActionType(string itemSize)
		{
            switch (itemSize)
            {
                case "1_10_ITEMS":
                    return "5_PLUS_VERIFIED_ITEMS";
                case "SMALL_BAG":
                    return "5_PLUS_VERIFIED_SMALL_BAG";
                case "LARGE_BAG":
                    return "5_PLUS_VERIFIED_LARGE_BAG";
                case "MORE_THAN_LARGE_BAG":
                    return "5_PLUS_VERIFIED_MORE_THAN_LARGE_BAG";
                default:
                    return "";
            }
        }
    }
}
