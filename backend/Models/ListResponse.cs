using System;
namespace trash2cash_backend.Models
{
	public class ListResponse<T>
	{
		public List<T> data { get; set; }
		public int length { get; set; }
	}
}

