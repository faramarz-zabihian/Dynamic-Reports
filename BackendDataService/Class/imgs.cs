using System.IO;
using System.Xml;
using System.Xml.Serialization;

/// <remarks/>
[System.Xml.Serialization.XmlTypeAttribute(AnonymousType = true)]
[System.Xml.Serialization.XmlRootAttribute(Namespace = "", IsNullable = false)]
public partial class imgs
{
    public imgs()
    {
    }

    public void Serialize(string path = "~/")
    {
        imgs im = this;
        im.img = new imgs_Img[3];
        im.img[0].desc = "";
        var ser = new XmlSerializer(typeof(imgs));
        var fs = new FileStream(path, FileMode.CreateNew, FileAccess.Write);
        TextWriter textw = new StreamWriter(fs);
        var tw = new XmlTextWriter(textw);
        ser.Serialize(tw, im);
    }

    private imgs_Img[] imgField;

    /// <remarks/>
    [System.Xml.Serialization.XmlElementAttribute("img")]
    public imgs_Img[] img
    {
        get
        {
            return this.imgField;
        }
        set
        {
            this.imgField = value;
        }
    }
}

/// <remarks/>
[System.Xml.Serialization.XmlTypeAttribute(AnonymousType = true)]
public partial class imgs_Img
{

    private string addrField;

    private string descField;

    /// <remarks/>
    public string addr
    {
        get
        {
            return this.addrField;
        }
        set
        {
            this.addrField = value;
        }
    }

    /// <remarks/>
    public string desc
    {
        get
        {
            return this.descField;
        }
        set
        {
            this.descField = value;
        }
    }
}

