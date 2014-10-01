using AngularFV.FCCommon;
using AngularFV.FCMessages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;

namespace AngularFV.services
{
    [ServiceContract(Namespace = "")]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class Messages
    {
        // To use HTTP GET, add [WebGet] attribute. (Default ResponseFormat is WebMessageFormat.Json)
        // To create an operation that returns XML,
        //     add [WebGet(ResponseFormat=WebMessageFormat.Xml)],
        //     and include the following line in the operation body:
        //         WebOperationContext.Current.OutgoingResponse.ContentType = "text/xml";
        [OperationContract]
        [WebGet]
        public string DoWork()
        {
            // Add your operation implementation here
            return "Hey";
        }

        [OperationContract]
        [WebGet]
        public List<Message> GetMessages(string folder, int? assetGroup, string filter)
        {
            bool outgoing = folder == "sent";
            var client = new MessageServiceClient();
            var messages = client.GetMessages(new GetMessagesRequest
                {
                    CID = 105,
                    MOStatus = outgoing ? 0 : 255,
                    MTStatus = outgoing ? 255 : 0,
                    //From = DateTime.Now.Date,
                    Assets = new FCMessages.Assets { assetGroup.HasValue 
                        ? new FCMessages.Asset { Category = FCMessages.AssetCategory.AssetGroup, Id = assetGroup.Value, AssetType = "vehicle" } 
                        : new FCMessages.Asset { Category = FCMessages.AssetCategory.Vehicle, Id = int.MaxValue, AssetType = "vehicle" } 
                    }
                });
            return (from m in messages.Messages.Items
                    let who = m.Vehicle != null && m.Vehicle != null ? m.Vehicle.Text : ""
                    let status = m.Status.MOStatus.HasValue 
                            ? (m.Status.MOStatus.Value == MOMsgState.READ ? "read" : "unread")
                            : ""
                    let poi = m.NearestCity != null ? m.NearestCity.Text : ""
                    where string.IsNullOrEmpty(filter) || (who + m.Preview + poi).ToLower().Contains(filter.ToLower())
                    select new Message 
                    { 
                        who = who,
                        text = m.Preview, 
                        date = m.CreationDTLocalText,
                        poi = poi, 
                        status = status,
                        id = m.Id.HasValue ? m.Id.ToString() : "",
                        type = m.MessageTypeText,
                        header = string.Format("{0}, {1}, {2}", m.MessageTypeText, who, status)
                    }).ToList();
        }

        [OperationContract]
        [WebGet]
        public long SendMessage(string to, string text)
        {
            return 0;
        }

        [OperationContract]
        [WebGet]
        public List<AssetGroup> GetAssetGroups()
        {
            var client = new CommonServiceClient();
            var assetGroups = client.RetrieveUserAssetGroups(105, null);
            return (from g in assetGroups
                    where !g.ParentId.HasValue
                    orderby g.Name
                    select new AssetGroup
                    {
                        id = g.Id.ToString(),
                        name = g.Name,
                        children = GetChildGroups(assetGroups, g.Id)
                    }).ToList();
        }

        private AssetGroup[] GetChildGroups(AssetGroups groups, int parentId)
        {
            return (from g in groups
                    where g.ParentId == parentId
                    select new AssetGroup
                {
                    id = g.Id.ToString(),
                    name = g.Name,
                    children = GetChildGroups(groups, g.Id)
                }).ToArray();
        }

        // Add more operations here and mark them with [OperationContract]
    }

    public class Message
    {
        public string who { get; set; }
        public string text { get; set; }
        public string date { get; set; }
        public string poi { get; set; }
        public string status { get; set; }
        public string id { get; set; }
        public string type { get; set; }
        public string header { get; set; }
    }

    public class AssetGroup
    {
        public string id { get; set; }
        public string name { get; set; }
        public AssetGroup[] children { get; set; }
    }
}
